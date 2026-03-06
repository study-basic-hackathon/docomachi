import { render, screen } from "@testing-library/react";
import { LoadingOverlay } from "../ui/LoadingOverlay";

describe("LoadingOverlay", () => {
  it("renders nothing when active is false", () => {
    const { container } = render(<LoadingOverlay active={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders overlay with spinner and text when active", () => {
    render(<LoadingOverlay active text="読み込み中..." />);
    expect(screen.getByRole("status", { name: "読み込み中" })).toBeInTheDocument();
    expect(screen.getByText("読み込み中...")).toBeInTheDocument();
  });
});
