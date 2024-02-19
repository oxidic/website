import type { RouteObject } from "react-router-dom";

import Home from "./Home";
import NotFound from "./NotFound";
import Play from "./Play";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/play",
    element: <Play />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
