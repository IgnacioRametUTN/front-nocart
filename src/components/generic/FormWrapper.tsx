import { ReactNode } from "react";

type FormWrapperProps = {
  title: string;
  children: ReactNode;
};

export function FormWrapper({ title, children }: FormWrapperProps) {
  return (
    <>
      <h3 style={{ textAlign: "center", margin: 0, marginBottom: "2rem" }}>
        {title}
      </h3>
      <div>{children}</div>
    </>
  );
}
