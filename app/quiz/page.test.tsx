import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import QuizPage from "./page";
import { fetchQuestions } from "@/src/lib/api/fetchQuestions";

jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
  }: {
    children: ReactNode;
    href: string;
  }) {
    return <a href={href}>{children}</a>;
  };
});

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock("@/components/HandDisplay", () => ({
  HandDisplay: () => <div data-testid="mock-hand-display" />,
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    disabled,
  }: {
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button type="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/AnswerPicker", () => ({
  AnswerPicker: ({
    onChange,
  }: {
    onChange: (tiles: string[]) => void;
  }) => (
    <button type="button" onClick={() => onChange(["m1"])}>
      選択
    </button>
  ),
}));

jest.mock("@/components/ResultModal", () => ({
  ResultModal: ({
    open,
    isCorrect,
  }: {
    open: boolean;
    isCorrect: boolean;
  }) => (open ? <div>{isCorrect ? "modal-correct" : "modal-incorrect"}</div> : null),
}));

jest.mock("@/src/lib/api/fetchQuestions");

const mockedFetchQuestions = fetchQuestions as jest.MockedFunction<typeof fetchQuestions>;

describe("QuizPage timer behavior", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockedFetchQuestions.mockResolvedValue([
      {
        id: "q1",
        tiles: ["m1"],
        winningTiles: ["m1"],
      },
    ]);
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("15秒以内の回答を通常判定する", async () => {
    render(<QuizPage />);

    await screen.findByText("解答する");
    fireEvent.click(screen.getByText("選択"));
    fireEvent.click(screen.getByText("解答する"));

    expect(await screen.findByText("modal-correct")).toBeInTheDocument();
  });

  it("15秒経過時に未回答なら不正解モーダルを表示する", async () => {
    render(<QuizPage />);

    await screen.findByText("解答する");
    act(() => {
      jest.advanceTimersByTime(15000);
    });

    expect(await screen.findByText("modal-incorrect")).toBeInTheDocument();
  });

  it("残り3秒以下でタイマー表示が赤文字になる", async () => {
    render(<QuizPage />);

    const timer = await screen.findByTestId("countdown-timer");
    act(() => {
      jest.advanceTimersByTime(12000);
    });

    await waitFor(() => expect(timer).toHaveTextContent("残り時間: 3秒"));
    expect(timer.className).toContain("text-red-300");
  });

  it("解答ボタン押下後はタイマー表示が停止する", async () => {
    render(<QuizPage />);

    const timer = await screen.findByTestId("countdown-timer");
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    await waitFor(() => expect(timer).toHaveTextContent("残り時間: 10秒"));

    fireEvent.click(screen.getByText("選択"));
    fireEvent.click(screen.getByText("解答する"));

    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(timer).toHaveTextContent("残り時間: 10秒");
  });

  it("時間切れ後の解答操作で重複確定しない", async () => {
    render(<QuizPage />);

    await screen.findByText("解答する");
    act(() => {
      jest.advanceTimersByTime(15000);
    });
    expect(await screen.findByText("modal-incorrect")).toBeInTheDocument();

    fireEvent.click(screen.getByText("選択"));
    fireEvent.click(screen.getByText("解答する"));

    expect(screen.getAllByText("modal-incorrect")).toHaveLength(1);
  });
});
