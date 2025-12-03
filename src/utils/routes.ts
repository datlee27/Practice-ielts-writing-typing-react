import { createBrowserRouter } from "react-router";
import { TypingInterface } from "../components/TypingInterface";
import { TestReport } from "../components/TestReport";
import { MockTest } from "../components/MockTest";
import { CustomPromptInput } from "../components/CustomPromptInput";
import { Home } from "../components/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/practice",
    Component: TypingInterface,
  },
  {
    path: "/mock-test",
    Component: MockTest,
  },
  {
    path: "/custom-prompt",
    Component: CustomPromptInput,
  },
  {
    path: "/report",
    Component: TestReport,
  },
]);
