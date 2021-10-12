import React, { useReducer } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";

import MessageAlert from "./MessageAlert";

import { messagesContext } from "./useMessages";

import { State, Reducer, PushMessage, Message } from "./types";

const initialState: State = {
  messages: [],
};

const reducer: Reducer = (state, action) => {
  switch (action.type) {
    case "push-message":
      state = { ...state, messages: [...state.messages, action.message] };
      break;

    case "remove-message":
      state = {
        ...state,
        messages: state.messages.filter(({ id }) => id !== action.id),
      };
      break;
  }
  return state;
};

const useStyles = makeStyles((theme) => ({
  messagesContainer: {
    position: "fixed",
    top: theme.spacing(1),
    right: theme.spacing(1),
    zIndex: 999,
    width: "max-content",
  },
}));

const MessagesProvider: React.FC = ({ children }) => {
  const classes = useStyles();
  const [state, disaptch] = useReducer(reducer, { ...initialState });

  const pushMessage: PushMessage = ({
    message,
    severity = "info",
    duration = 3000,
  }) => {
    const messageItem: Message = {
      id: Date.now().toString(),
      message,
      severity,
      duration,
    };
    disaptch({ type: "push-message", message: messageItem });
  };

  const handleOnClose = (id: string) => () => {
    disaptch({ type: "remove-message", id });
  };

  const messages = React.useMemo(() => {
    if (state.messages.length === 0) return null;

    return (
      <Grid
        className={classes.messagesContainer}
        container
        spacing={1}
        direction="column"
      >
        {state.messages.map((message) => {
          return (
            <Grid key={message.id} item>
              <MessageAlert
                duration={message.duration}
                message={message.message}
                onClose={handleOnClose(message.id)}
                severity={message.severity}
              />
            </Grid>
          );
        })}
      </Grid>
    );
  }, [state.messages, classes.messagesContainer]);

  return (
    <messagesContext.Provider value={{ pushMessage }}>
      {children}
      {messages}
    </messagesContext.Provider>
  );
};

export default MessagesProvider;
