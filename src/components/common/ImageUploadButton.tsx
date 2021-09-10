import React, { useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";

import useImageItems from "src/hooks/useImageItems";

export interface ImageUploadButtonProps {
  label: string;
  disabled?: boolean;
}

const useStyles = makeStyles((theme) => ({
  input: { display: "none" },
}));

const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({
  label,
  disabled = false,
}) => {
  const id = "image-upload-button";
  const classes = useStyles();

  const { state, addOriginalImage } = useImageItems();

  const onSelectImage: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    async (event) => {
      event.preventDefault();
      const file = event.currentTarget?.files?.item(0) ?? null;
      if (file !== null && state.status === "idle") {
        await addOriginalImage(file);
      }
    },
    [state.status, addOriginalImage]
  );

  return (
    <>
      <input
        className={classes.input}
        id={id}
        accept="image/*"
        multiple={false}
        type="file"
        onChange={onSelectImage}
        disabled={disabled}
      />
      <label htmlFor={id}>
        <Button
          color="primary"
          component="span"
          disabled={disabled}
          fullWidth
          variant="outlined"
        >
          {label}
        </Button>
      </label>
    </>
  );
};

export default ImageUploadButton;
