import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";

export interface ImageUploadButtonProps {
  label: string;
  disabled?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const useStyles = makeStyles((theme) => ({
  input: { display: "none" },
}));

const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({
  label,
  disabled = false,
  onChange,
}) => {
  const id = "image-upload-button";
  const classes = useStyles();

  return (
    <>
      <input
        className={classes.input}
        id={id}
        accept="image/*"
        multiple={false}
        type="file"
        onChange={onChange}
        disabled={disabled}
      />
      <label htmlFor={id}>
        <Button
          variant="outlined"
          color="primary"
          component="span"
          disabled={disabled}
        >
          {label}
        </Button>
      </label>
    </>
  );
};

export default ImageUploadButton;
