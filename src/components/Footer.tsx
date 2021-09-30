import { makeStyles } from "@material-ui/core/styles";

import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";

const useStyles = makeStyles((theme) => ({
  root: {
    "& *": {
      fontSize: "0.8rem",
      textAlign: "end",
    },
  },
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root} alignSelf="center" marginTop={0.5}>
      <Typography>
        &copy; Copyright {new Date().getFullYear()}{" "}
        <Link href="https://www.linkedin.com/in/lengzhang/">Leng Zhang</Link>.
        All rights reserved.{" "}
        <Link href="https://github.com/lengzhang/digital-image-processor">
          <GitHubIcon />
        </Link>{" "}
        <Link href="https://www.linkedin.com/in/lengzhang/">
          <LinkedInIcon />
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
