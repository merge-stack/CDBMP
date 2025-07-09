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
        label: 'In Corso',
        value: 'In Corso',
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
        label: '€20K',
        value: 20000,
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
        label: '€150K',
        value: 150000,
      },
      {
        label: '€200K',
        value: 100000,
      },
      {
        label: '€300K',
        value: 300000,
      },
      {
        label: '€500K',
        value: 500000,
      },
      {
        label: '€650K',
        value: 650000,
      },
    ],
  },
  {
    id: 'servizi_ecosistemici',
    label: 'Servizi Ecosistemici',
    options: [
      {
        label: 'Biodiversità',
        value: 'Biodiversità',
      },
      {
        label: 'Prevenzione Incendi',
        value: 'Prevenzione incendi',
      },
      {
        label: 'Sentieri Più Accessibili',
        value: 'Sentieri più accessibili',
      },
    ],
  },
];
