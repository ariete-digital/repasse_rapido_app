export interface Text {
  fontStyle?:
    | 'd-72'
    | 't-52'
    | 't-48'
    | 't-40'
    | 't-32'
    | 't-24'
    | 't-24'
    | 's-18'
    | 's-16'
    | 's-14'
    | 'p-10-bold'
    | 'p-18-bold'
    | 'p-18-medium'
    | 'p-18-regular'
    | 'p-16-bold'
    | 'p-16-medium'
    | 'p-16-regular'
    | 'p-14-bold'
    | 'p-14-medium'
    | 'p-14-regular'
    | 'c-12-medium'
    | 'c-12-bold'
    | 'c-12-regular';

  align?: 'right' | 'left' | 'center';

  decoration?: 'underline';
}

export interface Color {
  color:
    | 'clear-white'
    | 'white'
    | 'red'
    | 'yellow'
    | 'orange-text'
    | 'brand-blue'
    | 'brand-red'
    | 'brand-red-dark'
    | 'gray-500'
    | 'gray-300'
    | 'gray-200'
    | 'gray-100'
    | 'black'
    | 'black-900'
    | 'black-800'
    | 'black-700'
    | 'black-600'
    | 'black-500'
    | 'black-400'
    | 'black-300'
    | 'black-200'
    | 'black-100';
}
