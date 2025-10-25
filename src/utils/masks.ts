// Máscara para CPF: 000.000.000-00
export const maskCPF = (value: string): string => {
  if (!value) return '';
  
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

// Máscara para CNPJ: 00.000.000/0000-00
export const maskCNPJ = (value: string): string => {
  if (!value) return '';
  
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

// Máscara para Telefone: (00) 0000-0000 ou (00) 00000-0000
export const maskPhone = (value: string): string => {
  if (!value) return '';
  
  value = value.replace(/\D/g, '');
  
  if (value.length <= 10) {
    return value
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  } else {
    return value
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  }
};

// Máscara para CEP: 00000-000
export const maskCEP = (value: string): string => {
  if (!value) return '';
  
  return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1');
};

// Máscara para Placa: ABC-1234
export const maskPlaca = (value: string): string => {
  if (!value) return '';
  
  // Remove caracteres especiais exceto letras e números
  let cleanValue = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  
  // Aplica a máscara ABC-1234
  if (cleanValue.length >= 4) {
    return cleanValue.substring(0, 3) + '-' + cleanValue.substring(3, 7);
  }
  
  return cleanValue;
};

// Remove máscara (retorna apenas números)
export const unmask = (value: string): string => {
  if (!value) return '';
  return value.replace(/\D/g, '');
};


