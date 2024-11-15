import type { PropsWithChildren } from "react";
import { MemoryRouter } from "react-router-dom";
import type { MemoryRouterProps } from "react-router/dist/lib/components";

export default function TestRouterWrapper(props: PropsWithChildren<object> & MemoryRouterProps): JSX.Element {
  return <MemoryRouter initialEntries={props.initialEntries}> {props.children} </MemoryRouter>;
}
