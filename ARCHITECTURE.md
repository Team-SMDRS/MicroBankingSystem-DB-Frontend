# Banking System Frontend - Clean Architecture

## 🏗️ Project Structure

The project has been refactored into a clean, modular architecture with the following structure:

```
src/
├── components/
│   ├── account/
│   │   ├── AccountDetailsDisplay.tsx    # Displays account information
│   │   └── index.ts                     # Barrel exports
│   ├── common/
│   │   ├── Alert.tsx                    # Reusable alert component
│   │   ├── SubmitButton.tsx             # Reusable submit button
│   │   ├── TransactionResultDisplay.tsx # Shows transaction results
│   │   └── index.ts                     # Barrel exports
│   ├── forms/
│   │   ├── AccountNumberInput.tsx       # Account number input with fetch
│   │   ├── AmountInput.tsx              # Amount input with validation
│   │   ├── DescriptionInput.tsx         # Description textarea
│   │   └── index.ts                     # Barrel exports
│   └── layout/
│       ├── MainLayout.tsx               # Fixed sidebar layout
│       └── ...
├── hooks/
│   ├── useAccountOperations.ts          # Account-related operations
│   ├── useWithdrawalOperations.ts       # Withdrawal logic
│   └── useDepositOperations.ts          # Deposit logic
└── features/
    └── dashboard/
        └── forms/
            ├── WithdrawalForm.tsx       # Clean withdrawal form
            └── DepositForm.tsx          # Clean deposit form
```

## 🎯 Key Improvements

### 1. **Modular Components**
- **AccountNumberInput**: Handles account number entry and fetching details
- **AccountDetailsDisplay**: Shows customer and account information
- **AmountInput**: Validates amounts with max limits
- **DescriptionInput**: Reusable textarea component
- **Alert**: Multi-type alert component (error, success, info, warning)
- **SubmitButton**: Consistent button styling with loading states
- **TransactionResultDisplay**: Shows transaction confirmation details

### 2. **Custom Hooks**
- **useAccountOperations**: Core account fetching and authentication
- **useWithdrawalOperations**: Withdrawal-specific logic and validation
- **useDepositOperations**: Deposit-specific logic and operations

### 3. **Fixed Sidebar**
- Sidebar is now properly fixed to the left side
- Main content area accounts for sidebar width
- Responsive and scrollable navigation

### 4. **Clean Form Logic**
- Removed bloated single-file forms
- Separated concerns into logical components
- Reusable validation and error handling
- Consistent UI patterns across forms

## 🚀 Features

### Withdrawal Form
- **Account Lookup**: Fetch account details with authentication
- **Balance Validation**: Prevents overdrafts
- **Real-time Updates**: Updates balance after successful withdrawal
- **Error Handling**: Comprehensive error messages and auth token validation
- **Debug Tools**: Built-in authentication debugging

### Deposit Form
- **Account Verification**: Similar account lookup functionality
- **Unlimited Deposits**: No upper limit on deposit amounts
- **Transaction Tracking**: Full transaction result display
- **Consistent UX**: Same UI patterns as withdrawal form

## 🛠️ Technical Features

### Authentication
- **Token Management**: Automatic token injection in API calls
- **401 Handling**: Automatic redirect on authentication failure
- **Debug Support**: Console logging for token verification

### API Integration
- **Axios Interceptors**: Centralized request/response handling
- **Error Standardization**: Consistent error message formatting
- **Loading States**: Proper loading indicators throughout

### UI/UX
- **Responsive Design**: Works on all screen sizes
- **Consistent Styling**: Tailwind CSS with custom design system
- **Loading States**: Visual feedback for all async operations
- **Form Validation**: Client-side validation with helpful messages

## 📱 Usage

### Development
```bash
npm run dev
```
Access the application at `http://localhost:5174`

### Navigation
1. **Fixed Sidebar**: Navigate between different sections
2. **Transaction Forms**: Use Deposit/Withdrawal forms with account lookup
3. **Account Details**: View comprehensive account information
4. **Transaction Results**: See detailed transaction confirmations

### Form Workflow
1. Enter account number
2. Click "Fetch Details" to load account information
3. Enter transaction amount and description
4. Submit transaction
5. View transaction result and updated balance

## 🔧 Component API

### AccountNumberInput
```tsx
<AccountNumberInput
  accountNo={string}
  onAccountNoChange={(value: string) => void}
  onFetchDetails={() => void}
  isLoading={boolean}
  onDebugAuth={() => void}
/>
```

### AmountInput
```tsx
<AmountInput
  amount={string}
  onChange={(value: string) => void}
  maxAmount={number}
  label="Withdrawal Amount"
/>
```

### Alert
```tsx
<Alert type="error" | "success" | "info" | "warning">
  {children}
</Alert>
```

## 🎨 Styling

The application uses a modern design system with:
- **Gradient Backgrounds**: Subtle gradients for visual appeal
- **Rounded Corners**: Consistent border radius throughout
- **Shadow Effects**: Proper depth with shadow layers
- **Color Coding**: Different colors for different transaction types
- **Hover Effects**: Interactive feedback on all clickable elements

## 🔒 Security

- **Token-based Authentication**: Secure API access
- **Input Validation**: Client-side validation for all inputs
- **Error Handling**: Secure error messages without sensitive data exposure
- **Debug Mode**: Separate debug tools for development

This refactored architecture provides a clean, maintainable, and scalable codebase that follows React best practices and modern UI/UX patterns.
