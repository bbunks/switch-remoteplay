import { StreamRequestOptions } from "@lensesio/cypress-websocket-testing";
import { takeUntil, timer } from "rxjs";
import { WebSocketSubjectConfig } from "rxjs/webSocket";

type MessageType = "CONNECTED" | "LOGIN" | "RECORD" | "END";

interface IMessage {
  type: MessageType;
  data: any;
}

context("Controller Interactions", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.get("#port-input").clear().type("3001");
  });

  it("should send button even when clicked", () => {
    // For full set of config values, check rxjs documentation
    const config: WebSocketSubjectConfig<IMessage> = {
      url: "localhost:3001/socket.io/",
    };

    let options: Partial<StreamRequestOptions<IMessage>>;

    cy.stream<IMessage>(config).then((subject) => {
      subject.pipe(takeUntil(timer(3000))).subscribe({
        next: (results?: IMessage) => {
          cy.log(JSON.stringify(results));
          //expect(results).to.not.be.undefined;
        },
        error: (err: any) => {},
        complete: () => {},
      });
    });

    cy.get("button").contains("Connect").click();
    cy.get("[data-testid=button-L]").click();
  });
});

// cy.get("[data-testid=button-R]").click();
// cy.wrap(null, { timeout: 10000 })
//   .streamRequest<IMessage>(config, options)
//   .then((results) => {
//     expect(results).not.be.null;
//   });
