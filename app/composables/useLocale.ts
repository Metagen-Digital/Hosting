export function useLocale() {
  const { locale, setLocale } = useI18n()

  function toggleLocale() {
    setLocale(locale.value === 'en' ? 'bn' : 'en')
  }

  const localeLabel = computed(() => locale.value === 'en' ? 'বাং' : 'EN')
  const isEn = computed(() => locale.value === 'en')

  return { locale, toggleLocale, localeLabel, isEn, setLocale }
}
