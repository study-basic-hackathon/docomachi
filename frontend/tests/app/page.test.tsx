import { render, screen } from '@testing-library/react'
import TopPage from '@/app/page'
import { useRouter } from 'next/navigation'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('TopPage', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  it('緑背景が表示される', () => {
    const { container } = render(<TopPage />)
    const bgElement = container.querySelector('.bg-green-600')
    expect(bgElement).toBeInTheDocument()
  })

  it('バナー画像が表示される', () => {
    render(<TopPage />)
    const bannerImage = screen.getByAltText('Top Banner')
    expect(bannerImage).toBeInTheDocument()
  })

  it('スタートボタンが表示されクリック可能である', () => {
    render(<TopPage />)
    const startButton = screen.getByText('スタート')
    expect(startButton).toBeInTheDocument()
    expect(startButton).not.toBeDisabled()
  })

  it('レスポンシブレイアウトが適用される', () => {
    const { container } = render(<TopPage />)
    const mainContainer = container.firstChild
    expect(mainContainer).toHaveClass('flex', 'flex-col', 'items-center')
    const bannerContainer = container.querySelector('.max-w-4xl')
    expect(bannerContainer).toBeInTheDocument()
  })

  it('スタートボタンをクリックするとナビゲーションが実行される', () => {
    render(<TopPage />)
    const startButton = screen.getByText('スタート')
    startButton.click()
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('スタートボタンの連打で重複ナビゲーションが発生しない', () => {
    render(<TopPage />)
    const startButton = screen.getByText('スタート')
    startButton.click()
    startButton.click()
    startButton.click()
    // Should only be called once due to isNavigating state
    expect(mockPush).toHaveBeenCalledTimes(1)
  })
})
