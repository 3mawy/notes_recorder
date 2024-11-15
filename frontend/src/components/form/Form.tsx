import type { BaseSyntheticEvent, ComponentProps } from "react";
import type { FieldValues, SubmitHandler, UseFormReturn } from "react-hook-form";
import { FormProvider } from "react-hook-form";
import Box from "@mui/material/Box";

interface FormProps<T extends FieldValues = never> extends Omit<ComponentProps<"form">, "onSubmit"> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  stopPropagation?: boolean;
}

export const Form = <T extends FieldValues>({
  form,
  onSubmit,
  stopPropagation = false,
  children,
  ...props
}: FormProps<T>) => {

  const handleSubmit = (event: BaseSyntheticEvent) => {
    event.preventDefault();
    if (stopPropagation) {
      event.stopPropagation();
    }
    form.handleSubmit(onSubmit)();
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} noValidate {...props}>
        <Box
          className={props.className}
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
          style={{ opacity: form.formState.isSubmitting ? 0.5 : 1 }}
        >
          {children}
        </Box>
      </form>
    </FormProvider>
  );
};
