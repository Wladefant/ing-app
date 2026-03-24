# Demo Fixes — Problem List & Solutions

## Problem 1: Spending Widget Not Working as Pie Chart
**What's broken:** The `SpendingChartWidget` in chat-overlay.tsx shows a list breakdown but no visual pie chart. The pitch shows a pie diagram.
**Solution:** Add a Recharts `PieChart` to the `SpendingChartWidget` component, same style as the statistics screen. Keep the category list below it.

## Problem 2: Transfer Widget Missing Details
**What's broken:** The `TransferWidget` only shows name + amount + "Jetzt senden" button. No IBAN, no confirmation step, no "did you mean this person?" suggestion.
**Solution:** Add IBAN display (partially masked), a "Meintest du...?" alternative suggestion, and a two-step confirmation flow (review → confirm).

## Problem 3: No Direct Link to Live Quiz
**What's broken:** To access the live quiz, you navigate through the app. No direct URL.
**Solution:** Add route `/quiz` that opens the app directly on the Kahoot challenge screen. Already have `/kahoot/host` for the fullscreen host.

## Problem 4: Proactive Coaching Button Above App
**What's broken:** Proactive messages only appear once on first load after 3/8/14 seconds. On reload they don't reappear. Need a button to trigger them.
**Solution:** Add a desktop-only "Leo Coaching" button above the phone frame that triggers the proactive notifications on click. Reset the shown flag so they fire again.

## Problem 5: Adult/Junior Need Own URLs
**What's broken:** Reloading always goes back to the default state. If you were on adult, reload might show junior.
**Solution:** Add routes `/adult` and `/junior` that open the app in the respective profile. Store profile in URL params or separate routes.

## Problem 6: Junior Notification Button Above App
**What's broken:** In junior mode, there's no quick way to show the weekly salary notification without opening the demo sidebar.
**Solution:** Add a desktop-only button above the phone frame in junior mode that triggers the `junior_salary` scenario notification.

## Problem 7: Quick Access Buttons for Parent/Friction/Ukrainian Demos
**What's broken:** To access these demos you need to type the URL manually.
**Solution:** Add desktop-only buttons above the phone frame that link to `/demo/parent`, `/demo/friction`, `/demo/ukrainian`.

## Problem 8: "How are my investments" Should Show Portfolio Widget
**What's broken:** When asking Leo about investments, the AI response is text-only or shows a spending chart instead of a portfolio widget.
**Solution:** Ensure the `get_portfolio_data` tool returns data that gets rendered as a proper portfolio widget in the chat. Add a `PortfolioWidget` if one doesn't exist that shows holdings with values.

## Problem 9: Portfolio AI Analysis Shows Raw Markdown, Too Long
**What's broken:** The AI generates very long markdown responses for portfolio analysis. The markdown formatting (code blocks, headers) renders poorly or shows raw syntax. Response is too verbose.
**Solution:** Cap AI response length in the system prompt for portfolio queries. Ensure ReactMarkdown in chat-overlay handles all markdown elements properly. Add max-height with scroll for long messages.

## Implementation Order
1. Problem 5 (URLs) — foundational, affects all other fixes
2. Problem 4 + 6 + 7 (buttons above app) — group together
3. Problem 3 (quiz link) — quick route add
4. Problem 1 (spending pie chart) — widget fix
5. Problem 2 (transfer details) — widget enhancement
6. Problem 8 (portfolio widget) — new widget
7. Problem 9 (markdown/length) — polish
