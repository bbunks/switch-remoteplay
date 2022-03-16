import { GamepadAxisEvent, GamepadButtonEvent } from "gamepad.js";
import { GamepadListener } from "./GamepadListener";
import { DefaultControllerMap, GamepadMapping } from "./GamepadMapping";
import { GamepadState } from "./GamepadState";

// this will be for setting the connecting different inputs to the state
export abstract class GamepadStateController {
  GamepadMapping: GamepadMapping;
  protected _gamepadState: GamepadState;
  protected _paused: boolean;
  protected _activeListeners: {
    eventType: string;
    handler: (e: any) => void;
  }[];

  constructor(gamepadState: GamepadState) {
    this.GamepadMapping = new GamepadMapping();
    this._gamepadState = gamepadState;
    this._activeListeners = [];
    this._paused = false;
  }

  PauseListeners(): void {
    this._paused = true;
  }
  ResumeListeners(): void {
    this._paused = false;
  }

  abstract StartListeners(): void;
  abstract StopListeners(): void;
  abstract HijackListners(): void;
}

export class KeyboardController extends GamepadStateController {
  constructor(gamepadState: GamepadState) {
    super(gamepadState);
    this.PauseListeners = this.PauseListeners.bind(this);
    this.ResumeListeners = this.ResumeListeners.bind(this);
  }

  StartListeners(): void {
    // start button listeners
    const newDownListener = (e: KeyboardEvent) => {
      if (this._paused) return;
      this.GamepadMapping.getButtonBindings(e.key).forEach((binding) => {
        e.preventDefault();
        if (e.repeat) return;
        this._gamepadState.setButtonState(binding, true);
      });

      if (!this.GamepadMapping.getGamepadMapping().emulateSticks) return;
      this.GamepadMapping.getEmulatedStickBindings(e.key).forEach((binding) => {
        e.preventDefault();
        if (e.repeat) return;
        this._gamepadState.moveAxisState(
          binding.stick,
          binding.axis,
          binding.direction === "POSITIVE" ? 1 : -1
        );
      });
    };
    window.addEventListener("keydown", newDownListener);
    this._activeListeners.push({
      eventType: "keydown",
      handler: newDownListener,
    });

    const newUpListener = (e: KeyboardEvent) => {
      if (this._paused) return;
      this.GamepadMapping.getButtonBindings(e.key).forEach((binding) => {
        this._gamepadState.setButtonState(binding, false);
      });

      if (!this.GamepadMapping.getGamepadMapping().emulateSticks) return;
      this.GamepadMapping.getEmulatedStickBindings(e.key).forEach((binding) => {
        this._gamepadState.moveAxisState(
          binding.stick,
          binding.axis,
          binding.direction === "POSITIVE" ? -1 : 1
        );
      });
    };
    window.addEventListener("keyup", newUpListener);
    this._activeListeners.push({
      eventType: "keyup",
      handler: newUpListener,
    });
  }

  StopListeners(): void {
    this._activeListeners.forEach(({ eventType, handler }) => {
      window.removeEventListener(eventType, handler);
    });
  }

  HijackListners(): void {
    throw new Error("Method not implemented.");
  }
}

export class GamepadController extends GamepadStateController {
  private _gamepadIndex: number;
  constructor(gamepadState: GamepadState, GamepadIndex: number) {
    super(gamepadState);
    this._gamepadIndex = GamepadIndex;
    this.GamepadMapping = new GamepadMapping(DefaultControllerMap);
  }
  StartListeners(): void {
    const newButtonListener = (e: GamepadButtonEvent) => {
      this.GamepadMapping.getButtonBindings(e.detail.button).forEach(
        (binding) => {
          this._gamepadState.setButtonState(binding, e.detail.pressed);
        }
      );

      if (!this.GamepadMapping.getGamepadMapping().emulateSticks) return;
      this.GamepadMapping.getEmulatedStickBindings(e.detail.button).forEach(
        (binding) => {
          this._gamepadState.moveAxisState(
            binding.stick,
            binding.axis,
            binding.direction === "POSITIVE" ? 1 : -1
          );
        }
      );
    };
    GamepadListener.on(
      `gamepad:${this._gamepadIndex}:button`,
      newButtonListener
    );

    const newAxisListener = (e: GamepadAxisEvent) => {
      this.GamepadMapping.getAnalogStickBindings(
        e.detail.stick,
        e.detail.axis
      ).forEach((binding) => {
        this._gamepadState.setAxisState(
          binding.stick,
          binding.axis,
          e.detail.value
        );
      });
    };
    GamepadListener.on(`gamepad:${this._gamepadIndex}:axis`, newAxisListener);

    this._activeListeners.push({
      eventType: `gamepad:${this._gamepadIndex}:axis`,
      handler: newAxisListener,
    });
    this._activeListeners.push({
      eventType: `gamepad:${this._gamepadIndex}:button`,
      handler: newButtonListener,
    });
  }

  StopListeners(): void {
    this._activeListeners.forEach(({ eventType, handler }) => {
      GamepadListener.off(eventType, handler);
    });
  }

  HijackListners(): void {
    throw new Error("Method not implemented.");
  }
}
