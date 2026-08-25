import { useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { selectedFrom, selectedTo, fromCountry, toCountry, allCountries } from '@store/countries';
import type { Country, CountryCode } from '@app-types/country';

export function GlobeView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const selectedFromCode = useStore(selectedFrom);
  const selectedToCode = useStore(selectedTo);
  const fromC = useStore(fromCountry);
  const toC = useStore(toCountry);
  const countries = useStore(allCountries);

  useEffect(() => {
    if (!containerRef.current || countries.length === 0) return;

    let mounted = true;

    import('globe.gl').then(({ default: Globe }) => {
      if (!mounted || !containerRef.current) return;

      const GlobeInstance = new Globe(containerRef.current)
        .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-night.jpg')
        .atmosphereColor('lightskyblue')
        .atmosphereAltitude(0.1)
        .pointsData(countries)
        .pointLat('lat')
        .pointLng('lng')
        .pointColor((d: any) => {
          if (d.code === selectedFromCode) return 'red';
          if (d.code === selectedToCode) return 'blue';
          return 'orange';
        })
        .pointRadius(0.8)
        .pointResolution(12)
        .arcsData([])
        .arcColor(() => ['red', 'blue'])
        .arcDashLength(0.4)
        .arcDashGap(2)
        .arcDashAnimateTime(1000)
        .arcStroke(3)
        .onPointClick((point: any) => handlePointClick(point as Country))
        .width(containerRef.current.clientWidth)
        .height(containerRef.current.clientHeight);

      globeRef.current = GlobeInstance;

      updateGlobe(GlobeInstance);
    });

    return () => {
      mounted = false;
      if (globeRef.current) {
        globeRef.current.destroy();
        globeRef.current = null;
      }
    };
  }, [countries.length]);

  const handlePointClick = (point: Country) => {
    if (!point || !point.code) return;

    if (selectedFromCode === selectedToCode) {
      if (selectedFromCode !== point.code) {
        selectedTo.set(point.code as CountryCode);
      } else {
        selectedFrom.set(point.code as CountryCode);
      }
    } else if (selectedFromCode === point.code) {
      selectedTo.set(point.code as CountryCode);
    } else if (selectedToCode === point.code) {
      selectedFrom.set(point.code as CountryCode);
    } else {
      selectedFrom.set(point.code as CountryCode);
    }

    updateGlobe(globeRef.current);

    if (globeRef.current) {
      globeRef.current.pointOfView(
        { lat: point.lat, lng: point.lng, altitude: 1.5 },
        1000
      );
    }
  };

  const updateGlobe = (GlobeInstance: any) => {
    if (!GlobeInstance) return;

    GlobeInstance.pointColor((d: Country) => {
      if (d.code === selectedFromCode) return 'red';
      if (d.code === selectedToCode) return 'blue';
      return 'orange';
    });
    GlobeInstance.pointsData([...countries]);

    if (fromC && toC && fromC.code !== toC.code) {
      GlobeInstance.arcsData([
        {
          startLat: fromC.lat,
          startLng: fromC.lng,
          endLat: toC.lat,
          endLng: toC.lng,
        },
      ]);
      GlobeInstance.ringsData([
        { lat: fromC.lat, lng: fromC.lng },
        { lat: toC.lat, lng: toC.lng },
      ]);
      GlobeInstance.ringColor(() => (t: number) => `rgba(255,100,50,${1 - t})`);
      GlobeInstance.ringMaxRadius(2);
      GlobeInstance.ringPropagationSpeed(1);
    } else {
      GlobeInstance.arcsData([]);
      GlobeInstance.ringsData([]);
    }
  };

  useEffect(() => {
    if (globeRef.current) {
      updateGlobe(globeRef.current);
    }
  }, [selectedFromCode, selectedToCode, fromC, toC]);

  useEffect(() => {
    const handleResize = () => {
      if (globeRef.current && containerRef.current) {
        globeRef.current
          .width(containerRef.current.clientWidth)
          .height(containerRef.current.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      id="globeViz"
      className="w-full h-[600px] rounded-2xl overflow-hidden bg-[var(--bg-deep)]"
      role="img"
      aria-label="Interactive 3D globe showing country connections"
    />
  );
}