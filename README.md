# Velkommen til workshop med Norkart!

Dere setter opp en React-applikasjon med et Maplibre-kart, og utvider den med kartfunksjonalitet basert på data fra Norkart. Velg blant oppgavene under, eller lag noe helt selv.

Spør gjerne om noe er uklart.

## Nyttige lenker

- [React](https://react.dev/reference/react)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Material UI (MUI)](https://mui.com/material-ui/getting-started/)
- [MapLibre](https://maplibre-react-components.pentatrion.com/getting-started)

## Kom i gang

**Forutsetninger** — installer det du ikke har fra før:

1. **[Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)** — sjekk med `git --version`
2. **[GitHub](https://github.com/)**-bruker
3. **[Node.js + npm](https://nodejs.org/en/download)** — sjekk med `node --version` og `npm --version`
4. **Code editor** ([VS Code](https://code.visualstudio.com/download) anbefales)

**Fork, clone og kjør prosjektet:**

1. Fork dette prosjektet (`fork`-knappen øverst til høyre) med default innstillinger.

2. Klon din fork:

   ```
   git clone https://github.com/<YOUR_GITHUB_USERNAME>/norkart-webkurs-React.git
   ```

3. Åpne prosjektet i VS Code, åpne en terminal, og installer npm-pakkene:

   ```
   npm install
   ```

4. **API-nøkkel**: opprett en fil `.env` i rotmappa med innholdet:

   ```
   VITE_API_KEY=<din API-nøkkel>
   ```

   **API-nøkkelen skal aldri lastes opp på GitHub — `.env` skal ikke committes!**

5. Kjør prosjektet:

   ```
   npm run dev
   ```

   Åpne http://localhost:5173/.

## Oppgaver

Kan gjøres i valgfri rekkefølge (unntatt noen ekstraoppgaver som bygger på tidligere oppgaver). Komfortabel med React/TypeScript? Gjør gjerne noe helt eget med dataene og verktøyene som er tilgjengelig!

### Oppgave 1: Utvid kartfunksjonaliteten

Følg [Maplibre sin tutorial](https://maplibre-react-components.pentatrion.com/tutorial) for å legge til flere funksjoner i appen.
_ℹ️ Vi bruker TypeScript, ikke JavaScript — tilpass koden fra tutorialen deretter. Spør om hjelp ved behov!_

### Oppgave 2: Vis høyde i kartet basert på punkt

[getHoydeFromPunkt.ts](/src/api/getHoydeFromPunkt.ts) henter høyde for et geografisk punkt. I [MapLibreMap.tsx](/src/components/MapLibreMap.tsx) lagres høyden i staten `pointHoyde` og logges til konsollen ved klikk i kartet. Implementer en visning av denne høyden i applikasjonen.

Forslag: bruk [RPopup](https://maplibre-react-components.pentatrion.com/components/rpopup), eller lag en egen komponent (f.eks. et MUI [Card](https://mui.com/material-ui/react-card/)) som viser latitude, longitude og høyde.

Hint: latitude/longitude for valgt punkt ligger i staten `clickPoint` — nyttig for RPopup.

### Oppgave 3: Implementer søk etter adresse

[SearchBar.tsx](/src/components/SearchBar.tsx) eksporterer en søkekomponent. Importer og plasser den i [MapLibreMap.tsx](/src/components/MapLibreMap.tsx):

```
import { SearchBar, type Address } from './SearchBar';
```

Legg til en state for valgt adresse:

```
export const MapLibreMap = () => {
   const [hoyde, setHoydeAtPunkt] = useState<undefined | number>(undefined);
   const [address, setAddress] = useState<Address | null>(null); // <--- Legg til dette!
  ...
}
```

Render `SearchBar` inni `Overlay`, og gi den state-setteren:

```
export const MapLibreMap = () => {
  ...

  return (
    <RMap
      ...
    >
      <Overlay>
        <SearchBar setAddress={setAddress}/> // <--- Legg til denne
      </Overlay>
      <DrawComponent />
    </RMap>
  );
};
```

Søkefeltet vises nå, men uten forslag. Bruk [getAddresserFromSearchText](/src/api/getAdresserFromSearchText.ts) i `SearchBar` for å hente adresseforslag fra Norkarts API.

Hint: adressealternativene settes i konstanten `adresser` i `useEffect` — husk `await` siden funksjonen er asynkron (se hvordan `getHoydeFromPunkt` brukes i [MapLibreMap.tsx](/src/components/MapLibreMap.tsx) som eksempel).

Deretter: la kartet "fly til" valgt adresse ved å bruke `address`-staten sammen med `MapFlyTo`:

```
<RMap
      minZoom={6}
      ...
>
   {address && (
      <MapFlyTo
         lngLat={
         new LngLat(address.PayLoad.Posisjon.X, address.PayLoad.Posisjon.Y)
         }
      />
   )}
</RMap>
```

### Oppgave 4: Vis bygninger i kartet

Implementer [getBygningAtPunkt.ts](/src/api/getBygningAtPunkt.ts) (se filen for instruksjoner) for å hente bygningsdata for et punkt. Bruk den deretter i [MapLibreMap.tsx](/src/components/MapLibreMap.tsx):

1. Legg til importene:

   ```
   import { getBygningAtPunkt } from '../api/getBygningAtPunkt';
   import type { GeoJSON } from 'geojson';
   ```

2. Ny state for bygningsomrisset:

   ```
   const [bygningsOmriss, setBygningsOmriss] = useState<GeoJSON | undefined>(undefined);
   ```

3. Hent bygningsdata ved klikk (forutsetter at `getBygningAtPunkt` returnerer én bygning, ikke en liste):

   ```
   const onMapClick = async (e: MapLayerMouseEvent) => {
      const bygningResponse = await getBygningAtPunkt(e.lngLat.lng, e.lngLat.lat)
      if (bygningResponse?.FkbData?.BygningsOmriss) {
         const geoJsonObject = JSON.parse(bygningResponse.FkbData.BygningsOmriss);
         setBygningsOmriss(geoJsonObject);
      } else {
         setBygningsOmriss(undefined);
      }
      ...
   }
   ```

4. Legg til en polygon-stil (fritt å redigere):

   ```
   const polygonStyle = {
      "fill-outline-color": "rgba(0,0,0,0.1)",
      "fill-color":  "rgba(18, 94, 45, 0.41)"
   }
   ```

5. Oppdater MapLibre-importen:

   ```
   import { RLayer, RMap, RSource, useMap } from 'maplibre-react-components';
   ```

6. Vis polygonet når `bygningsOmriss` er satt:

   ```
   <RMap
      ...
   >
         {bygningsOmriss &&
            <>
               <RSource id="bygning" type="geojson" data={bygningsOmriss} />
               <RLayer
                  source="bygning"
                  id="bygning-fill"
                  type="fill"
                  paint={polygonStyle}
               />
            </>
         }
   </RMap>
   ```

#### Ekstraoppgaver

- API-et returnerer også andre bygningsdata — vis dem med en [RPopup](https://maplibre-react-components.pentatrion.com/components/rpopup) eller et [MUI Card](https://mui.com/material-ui/react-card/).
- Har du implementert adressesøk ([Oppgave 3](#oppgave-3-implementer-søk-etter-adresse))? Bruk posisjonen fra valgt adresse til å hente og vise bygningen der.
- Implementer [getRosDataForBygning](/src/api/getRosDataForBygning.ts) for å hente Risiko- og sårbarhetsdata (ROS) for en bygning, og vis det i kartet eller med MUI-komponenter.

### Oppgave 5: Hent og vis solmengde for tak ved punkt

Implementer [getTakflateDataForPunkt](/src/api/getTakflateDataForPunkt.ts) for å hente solmengde-data for et tak ved et punkt.

Bruk funksjonen i `onMapClick` i [MapLibreMap.tsx](/src/components/MapLibreMap.tsx) for å vise takets geometri i kartet (se [Oppgave 4](#oppgave-4-vis-bygninger-i-kartet)) og den beregnede solmengden (kWh/m² per måned), f.eks. med [MUI Table](https://mui.com/material-ui/react-table/).

#### Ekstraoppgave

Har du implementert [getBygningAtPunkt](/src/api/getBygningAtPunkt.ts) ([Oppgave 4](#oppgave-4-vis-bygninger-i-kartet))? Bruk bygningsnummeret til å implementere [getTakflateDataForBygning](/src/api/getTakflateDataForBygning.ts) og hent solmengde for alle tak på bygningen — vis dem i kartet og som total solmengde over året.

### Oppgave 6: Gjør noe med andre, åpne geografiske data

Eksempler:

- [MapLibre GL sine eksempler](http://maplibre.org/maplibre-gl-js/docs/examples/)
- [Historiske Oslo bysykkel-data](https://oslobysykkel.no/en/open-data/historical)
- Lag et koroplettkart av Norges befolkning fra [befolkning_5km.json](/src/sample_data/befolkning_5km.json) (5x5km ruter)
- Visualiser din egen data — lag GeoJSON på [geojson.io](https://geojson.io/#map=2/20.0/0.0)
