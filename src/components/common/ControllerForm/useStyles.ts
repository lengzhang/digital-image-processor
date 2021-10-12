import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  selectField: {
    minWidth: theme.spacing(15),
    width: "max-content",
  },
  textField: {
    minWidth: theme.spacing(15),
    width: theme.spacing(15),
  },
}));

export default useStyles;
