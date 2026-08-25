import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { fromCountry, toCountry, swapCountries } from '@store/countries';
import { fetchExchangeRates, calculateCurrencyConversion, getExchangeRate } from '@services/api/currency';
import { useToast } from '@hooks';

export function CurrencyConverter() {
  const fromC = useStore(fromCountry);
  const toC = useStore(toCountry);
  const { addToast } = useToast();

  const [fromAmount, setFromAmount] = useState(1);
  const [toAmount, setToAmount] = useState(0);
  const [rate, setRate] = useState<string>('--');
  const [reverseRate, setReverseRate] = useState<string>('--');
  const [lastUpdated, setLastUpdated] = useState<string>('--');
  const [isLoading, setIsLoading] = useState(false);

  const updateConversion = async () => {
    if (!fromC || !toC) return;

    setIsLoading(true);
    try {
      const rates = await fetchExchangeRates();

      if (fromC.currency === toC.currency) {
        setToAmount(fromAmount);
        setRate(`Same currency: ${fromC.currencyName}`);
        setReverseRate('');
      } else {
        const converted = calculateCurrencyConversion(fromC.currency, toC.currency, fromAmount, rates);
        const revRate = getExchangeRate(toC.currency, fromC.currency, rates);

        if (converted !== null) {
          setToAmount(converted);
        }
        if (revRate !== null) {
          setReverseRate(`1 ${toC.currency} = ${revRate.toFixed(6)} ${fromC.currency}`);
        }
        const fwdRate = getExchangeRate(fromC.currency, toC.currency, rates);
        if (fwdRate !== null) {
          setRate(`1 ${fromC.currency} = ${fwdRate.toFixed(6)} ${toC.currency}`);
        }
      }

      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      addToast('Failed to update conversion', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    updateConversion();
  }, [fromC, toC, fromAmount]);

  const handleSwap = () => {
    swapCountries();
    const temp = fromAmount;
    setFromAmount(toAmount);
    setToAmount(temp);
    addToast('Currencies swapped', 'success');
  };

  const handleRefresh = async () => {
    addToast('Refreshing exchange rates...', 'info');
    await updateConversion();
    addToast('Exchange rates updated', 'success');
  };

  if (!fromC || !toC) {
    return (
      <div className="glass-card animate-fade-in">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 justify-center">
          <span className="text-xl">💱</span>
          Currency Exchange
        </h3>
        <p className="text-center text-[var(--text-secondary)] py-8">Select two countries to compare currencies</p>
      </div>
    );
  }

  return (
    <div className="glass-card animate-fade-in">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 justify-center">
        <span className="text-xl">💱</span>
        Currency Exchange
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-6">
        <CurrencyInput
          country={fromC}
          amount={fromAmount}
          onChange={setFromAmount}
          isFrom={true}
        />

        <button
          onClick={handleSwap}
          className="btn-icon mx-auto my-2 md:my-0"
          aria-label="Swap currencies"
          title="Swap currencies"
        >
          ⇄
        </button>

        <CurrencyInput
          country={toC}
          amount={toAmount}
          onChange={() => {}}
          readonly
          isFrom={false}
        />
      </div>

      <div className="space-y-3 mb-4">
        <div className="p-3 rounded-xl bg-white/5 text-center">
          <p className="text-sm font-medium text-[var(--primary-accent)]">{rate}</p>
          {reverseRate && <p className="text-xs text-[var(--text-secondary)] mt-1">{reverseRate}</p>}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <span>Last updated:</span>
          <span className="font-mono">{lastUpdated}</span>
        </div>
        <button onClick={handleRefresh} disabled={isLoading} className="btn-secondary">
          {isLoading ? '⟳ Refreshing...' : '🔄 Refresh Rates'}
        </button>
      </div>
    </div>
  );
}

function CurrencyInput({
  country,
  amount,
  onChange,
  readonly = false,
  isFrom,
}: {
  country: any;
  amount: number;
  onChange: (value: number) => void;
  readonly?: boolean;
  isFrom: boolean;
}) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
      <span className="text-3xl block mb-2">{country.flag}</span>
      <input
        type="number"
        step="0.01"
        min="0"
        value={amount}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        readOnly={readonly}
        className="w-full max-w-[200px] mx-auto px-4 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-center text-lg font-semibold focus:outline-none focus:border-[var(--primary-accent)] focus:ring-2 focus:ring-[var(--primary-accent)]/20"
        aria-label={isFrom ? `Amount in ${country.currency}` : `Converted amount in ${country.currency}`}
      />
      <div className="mt-2 space-y-1">
        <p className="font-semibold">{country.currency}</p>
        <p className="text-xs text-[var(--text-secondary)]">{country.currencyName}</p>
      </div>
    </div>
  );
}