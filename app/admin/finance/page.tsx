// app/finance/page.tsx
import FinanceOverview from '../../../components/FinanceOverview';

export const metadata = {
  title: 'Фінансова звітність',
};

export default function FinancePage() {
  return (
    <main className="p-6">
      <FinanceOverview />
    </main>
  );
}
