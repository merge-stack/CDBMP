export const FILTERS = [
  {
    id: 'area',
    label: "Stato dell'area",
    options: [
      {
        label: 'Da Recuperare',
        value: 'Da Recuperare',
      },
      {
        label: 'In Recupero',
        value: 'In Recupero',
      },
      {
        label: 'Recuperata',
        value: 'Recuperata',
      },
    ],
  },
  {
    id: 'intervention',
    label: 'Tipo di intervento',
    options: [
      {
        label: 'Riforestazione',
        value: 'Riforestazione',
      },
      {
        label: 'Avviamento ad alto fusto',
        value: 'Avviamento ad alto fusto',
      },
      {
        label: 'Taglio ceduo',
        value: 'Taglio ceduo',
      },
      {
        label: 'Recupero post-incendio',
        value: 'Recupero post-incendio',
      },
      {
        label: 'Selvicoltura ad albero',
        value: 'Selvicoltura ad albero',
      },
    ],
  },
  {
    id: 'budget',
    label: 'Budget stimato',
    type: 'range',
    options: [
      {
        label: '€0',
        value: 0,
      },
      {
        label: '€5K',
        value: 5000,
      },
      {
        label: '€10K',
        value: 10000,
      },
      {
        label: '€50K',
        value: 50000,
      },
      {
        label: '€100K',
        value: 100000,
      },
      {
        label: '€300K',
        value: 300000,
      },
    ],
  },
  {
    id: 'priority',
    label: 'Priorità',
    options: [
      {
        label: 'Urgente',
        value: 'urgente',
      },
      {
        label: 'Media',
        value: 'media',
      },
      {
        label: 'Bassa',
        value: 'bassa',
      },
    ],
  },
  {
    id: 'participation',
    label: 'Modalità di partecipazione',
    options: [],
  },
];
