# Search Functionality Test Plan

## Application Overview

This test plan covers the Search functionality for the product listing on https://www.saucedemo.com/. Note: the current Saucedemo inventory page does not include a search input; these tests assume a search component will be added to the Products/Inventory page (visible in the header or above the product grid). Starting state for all tests: fresh browser, cleared cache, user logged out. Tests include happy paths, negative/edge cases, accessibility, performance, security and integration with sorting/filters. Success criteria: search returns correct items, UI is accessible, robust to invalid input and network errors, and performs within acceptable limits.

## Test Scenarios

### 1. Search Functionality

**Seed:** `tests/seed.spec.ts`

#### 1.1. Exact match — product name

**File:** `tests/search.spec.ts`

**Steps:**
  1. Start with a fresh browser state.
  2. Login as `standard_user` (username: `standard_user`, password: `secret_sauce`).
  3. Navigate to `/inventory.html` (Products page).
  4. Verify a search input (ARIA labelled or with placeholder like `Search` or `Search products`) is visible.
  5. Enter the exact product name `Sauce Labs Backpack` into the search input and submit (press Enter or click Search).
  6. Wait for results to render.
  7. Verify that the results list shows exactly the `Sauce Labs Backpack` item and no other items (or that it is the top/only result).

**Expected Results:**
  - The product list contains `Sauce Labs Backpack`.
  - Results count equals 1 (or only matching items displayed).
  - Product card shows correct name, price, and `Add to cart` button.

#### 1.2. Partial match — substring search

**File:** `tests/search.spec.ts`

**Steps:**
  1. Login and navigate to `/inventory.html`.
  2. Ensure the search input is visible.
  3. Enter a partial term `Backpack` and submit.
  4. Wait for results.
  5. Verify that the results include `Sauce Labs Backpack` and include any other items containing the substring.

**Expected Results:**
  - Results include items whose names contain `Backpack`.
  - At least one matching product is displayed and its card is correct.

#### 1.3. Case-insensitive search

**File:** `tests/search.spec.ts`

**Steps:**
  1. Login and navigate to `/inventory.html`.
  2. Ensure search input is visible.
  3. Enter `sAuCe lAbS bAcKpAcK` (mixed casing) and submit.
  4. Wait for results.
  5. Verify matching occurs regardless of case.

**Expected Results:**
  - Search should return `Sauce Labs Backpack` despite case differences.
  - Behavior is consistent with exact/partial matching rules.

#### 1.4. Trim leading/trailing spaces

**File:** `tests/search.spec.ts`

**Steps:**
  1. Login and navigate to `/inventory.html`.
  2. Ensure search input is visible.
  3. Enter `  Sauce Labs Backpack  ` (with leading and trailing spaces) and submit.
  4. Wait for results.
  5. Verify input is trimmed and correct results returned.

**Expected Results:**
  - Search ignores leading/trailing whitespace and returns expected products.

#### 1.5. Empty query shows full product list

**File:** `tests/search.spec.ts`

**Steps:**
  1. Login and navigate to `/inventory.html`.
  2. Ensure search input is visible.
  3. Clear the search input or submit an empty value.
  4. Observe the results shown.

**Expected Results:**
  - All products are displayed (same as initial page load).
  - No errors are shown when querying with an empty string.

#### 1.6. No-results behavior

**File:** `tests/search.spec.ts`

**Steps:**
  1. Login and navigate to `/inventory.html`.
  2. Ensure search input is visible.
  3. Enter a non-existent term `no-such-product-12345` and submit.
  4. Wait for results render.
  5. Verify UI shows a helpful no-results message and no product cards.

**Expected Results:**
  - A clear message like `No results found` or `No products match your search` is shown.
  - No product cards are displayed in the results area.

#### 1.7. Special characters and punctuation

**File:** `tests/search.spec.ts`

**Steps:**
  1. Login and navigate to `/inventory.html`.
  2. Ensure search input is visible.
  3. Enter `Test.allTheThings()` (contains dot and parentheses) and submit.
  4. Wait for results.
  5. Verify correct product `Test.allTheThings() T-Shirt (Red)` appears if applicable.

**Expected Results:**
  - Search handles punctuation and special characters correctly and returns matching product(s).

#### 1.8. Search + sort integration

**File:** `tests/search.spec.ts`

**Steps:**
  1. Login and navigate to `/inventory.html`.
  2. Ensure search input and sort combobox are visible.
  3. Enter `T-Shirt` and submit to filter results to T-Shirt products.
  4. Change sort from `Name (A to Z)` to `Price (low to high)`.
  5. Verify the displayed set of search results remains filtered by search term and the order matches the selected sort criteria.

**Expected Results:**
  - Search results remain restricted to the search term after changing sort.
  - Results are ordered according to the selected sort option (e.g., ascending price).

#### 1.9. Keyboard accessibility — Enter triggers search

**File:** `tests/search.spec.ts`

**Steps:**
  1. Login and navigate to `/inventory.html`.
  2. Ensure search input is focusable via keyboard (Tab).
  3. Focus the search input, type `Onesie`, and press Enter.
  4. Verify the search is submitted and results update accordingly.

**Expected Results:**
  - Pressing Enter from the search input triggers the search.
  - Search input has accessible name/label and is reachable by keyboard alone.

#### 1.10. Security — input sanitization / XSS protection

**File:** `tests/search.spec.ts`

**Steps:**
  1. Login and navigate to `/inventory.html`.
  2. Ensure search input is visible.
  3. Enter a potentially malicious string `<script>alert(1)</script>` and submit.
  4. Observe UI and console for unexpected script execution or DOM insertion.

**Expected Results:**
  - No scripts execute and no script tags are injected into the DOM.
  - App treats the input as plain text and either safely escapes it or shows a `no results` message.

#### 1.11. Performance — results render quickly

**File:** `tests/search.spec.ts`

**Steps:**
  1. Login and navigate to `/inventory.html`.
  2. Ensure search input is visible.
  3. Enter `Sauce` or another common term and submit.
  4. Measure time from submit to results rendered.

**Expected Results:**
  - Results render within an acceptable time threshold (suggested: < 500ms for client-side filtering; < 1s for server search).
  - No UI jank or blocking on search.

#### 1.12. Network error handling

**File:** `tests/search.spec.ts`

**Steps:**
  1. Login and navigate to `/inventory.html`.
  2. Simulate a network failure or force the search API to return 5xx (if search is server-backed).
  3. Enter a valid term like `Backpack` and submit.
  4. Observe UI behavior and error messaging.

**Expected Results:**
  - UI displays a friendly, actionable error (e.g., `Search temporarily unavailable, try again later`).
  - No application crash; retry option shown if applicable.
