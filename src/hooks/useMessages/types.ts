import { AlertProps } from "@material-ui/lab/Alert";

export interface Message extends Required<Pick<AlertProps, "severity">> {
  id: string;
  message: string;
  duration: number;
}

export interface State {
  messages: Message[];
}

type Action =
  | { type: "push-message"; message: Message }
  | { type: "remove-message"; id: string };

export interface Reducer {
  (state: State, action: Action): State;
}

export interface PushMessage {
  (
    params: Partial<Pick<Message, "severity" | "duration">> & {
      message: string;
    }
  ): void;
}

export interface MessagesContext {
  pushMessage: PushMessage;
}
