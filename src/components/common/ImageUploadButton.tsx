import React, { useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";

import { useAppDispatch, useAppSelector } from "src/redux/store";

import { setOriginalFile } from "src/redux/reducer/imageItems";

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

  const { status } = useAppSelector((state) => state.imageItems);
  const appDispatch = useAppDispatch();

  const onSelectImage: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    async (event) => {
      event.preventDefault();
      const file = event.currentTarget?.files?.item(0) ?? null;
      if (file !== null && status === "idle") {
        await appDispatch(setOriginalFile(file));
      }
    },
    [status, appDispatch]
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
