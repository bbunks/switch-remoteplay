import { GamepadAxisEvent, GamepadButtonEvent } from "gamepad.js";
import { GamepadListener } from "./GamepadListener";
import { GamepadMapping } from "./GamepadMapping";
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
  protected _hijackButtonMethod:
    | ((e: GamepadButtonEvent | KeyboardEvent) => void)
    | null;
  protected _hijackStickMethod: ((e: GamepadAxisEvent) => void) | null;

  constructor(gamepadState: GamepadState, gamepadMapping: GamepadMapping) {
    this.GamepadMapping = gamepadMapping;
    this._gamepadState = gamepadState;
    this._activeListeners = [];
    this._paused = false;
    this._hijackButtonMethod = null;
    this._hijackStickMethod = null;
  }

  PauseListeners(): void {
    this._paused = true;
  }

  ResumeListeners(): void {
    this._paused = false;
    this._hijackButtonMethod = null;
    this._hijackStickMethod = null;
  }

  abstract StartListeners(): void;
  abstract StopListeners(): void;
  HijackButtonListners(
    cb: (e: KeyboardEvent | GamepadButtonEvent) => void
  ): void {
    this._hijackButtonMethod = cb;
  }
  HijackStickListners(cb: (e: GamepadAxisEvent) => void): void {
    this._hijackStickMethod = cb;
  }
}

export class KeyboardController extends GamepadStateController {
  constructor(gamepadState: GamepadState, gamepadMapping: GamepadMapping) {
    super(gamepadState, gamepadMapping);
    this.PauseListeners = this.PauseListeners.bind(this);
    this.ResumeListeners = this.ResumeListeners.bind(this);
  }

  StartListeners(): void {
    // start button listeners
    const newDownListener = (e: KeyboardEvent) => {
      if (this._paused) return;
      if (this._hijackButtonMethod) {
        this._hijackButtonMethod(e);
        return;
      }
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
      if (this._hijackButtonMethod) {
        this._hijackButtonMethod(e);
        return;
      }
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
}

export class GamepadController extends GamepadStateController {
  private _gamepadIndex: number;
  constructor(
    gamepadState: GamepadState,
    GamepadIndex: number,
    gamepadMapping: GamepadMapping
  ) {
    super(gamepadState, gamepadMapping);
    this._gamepadIndex = GamepadIndex;
  }
  StartListeners(): void {
    const newButtonListener = (e: GamepadButtonEvent) => {
      if (this._hijackButtonMethod) {
        this._hijackButtonMethod(e);
        return;
      }
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
      if (this._hijackStickMethod) {
        this._hijackStickMethod(e);
        return;
      }
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
}
