import { createBrowserRouter } from "react-router";
import { PracticePage } from "../pages/PracticePage";
import { TestReportPage } from "../pages/TestReportPage";
import { MockTestPage } from "../pages/MockTestPage";
import { CustomPromptPage } from "../pages/CustomPromptPage";
import { HomePage } from "../pages/HomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/practice",
    Component: PracticePage,
  },
  {
    path: "/mock-test",
    Component: MockTestPage,
  },
  {
    path: "/custom-prompt",
    Component: CustomPromptPage,
  },
  {
    path: "/report",
    Component: TestReportPage,
  },
]);