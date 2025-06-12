/**
 * Technical details configuration for the DetailPanel
 */
export const TECHNICAL_DETAILS = {
  primary: [
    { 
      id: 'estimate',
      label: 'Stima', 
      value: '5.575,21 €',
      formatter: (value) => `${value} €`
    },
    { 
      id: 'area',
      label: 'Superficie', 
      value: '0,3339',
      unit: 'ha',
      formatter: (value) => `${value} ha`
    },
    {
      id: 'slope',
      label: 'Pendenza (min / avg / max / classe)',
      value: { min: 8.53, avg: 10.60, max: 12.29, class: 'A' },
      formatter: (value) => `${value.min} deg / ${value.avg} deg / ${value.max} deg / ${value.class}`
    },
    {
      id: 'transport',
      label: 'Trasporto (strade / sentieri / classe)',
      value: { roads: 25.47, paths: 0.00, class: 1 },
      formatter: (value) => `${value.roads} m / ${value.paths} m / ${value.class}`
    },
    {
      id: 'paths',
      label: "Sentieri presenti nell'area (metri / dettaglio)",
      value: { total: 46, details: [{ name: 'Sentiero 135', length: 46 }] },
      formatter: (value) => `TOTALE: ${value.total} m\n${value.details.map(d => `${d.name}: ${d.length} m`).join('\n')}`
    }
  ],
  secondary: [
    { 
      id: 'estimate2',
      label: 'Stima', 
      value: '5.575,21 €',
      formatter: (value) => `${value} €`
    },
    { 
      id: 'area2',
      label: 'Superficie', 
      value: '0,3339',
      unit: 'ha',
      formatter: (value) => `${value} ha`
    },
    {
      id: 'slope2',
      label: 'Pendenza (min / avg / max / classe)',
      value: { min: 8.53, avg: 10.60, max: 12.29, class: 'A' },
      formatter: (value) => `${value.min} deg / ${value.avg} deg / ${value.max} deg / ${value.class}`
    }
  ]
}; 