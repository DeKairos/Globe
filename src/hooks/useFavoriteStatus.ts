import { useEffect, useState } from 'react';
import { isFavorite as checkIsFavorite } from '@services/storage/favorites';
import type { CountryCode } from '@app-types/country';

export function useFavoriteStatus(countryCode: CountryCode | undefined): boolean {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    if (!countryCode) {
      setIsFav(false);
      return;
    }

    async function check() {
      const fav = await checkIsFavorite(countryCode as CountryCode);
      setIsFav(fav);
    }
    check();
  }, [countryCode]);

  return isFav;
}