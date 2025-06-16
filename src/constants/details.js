/**
 * Technical details configuration for the DetailPanel
 */
export const TECHNICAL_DETAILS = {
  primary: [
    {
      id: 'slope',
      title: 'Pendenza',
      subTitle: '(min / avg / max / classe)',
      value: { min: 8.53, avg: 10.6, max: 12.29, class: 'A' },
      formatter: (value) =>
        `${value.min} deg / ${value.avg} deg / ${value.max} deg / ${value.class}`,
    },
    {
      id: 'transport',
      title: 'Trasporto ',
      subTitle: '(strade / sentieri / classe)',
      value: { roads: 25.47, paths: 0.0, class: 1 },
      formatter: (value) =>
        `${value.roads} m / ${value.paths} m / ${value.class}`,
    },
  ],
};
