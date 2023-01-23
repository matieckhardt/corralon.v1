function filterYearMonth(year, month) {
  const minDate = new Date(year, month || 0);
  const maxDate = new Date(
    ...(month !== undefined ? [year, month + 1] : [year + 1, 0])
  );

  return {
    createdAt: {
      $gte: minDate,
      $lt: maxDate,
    },
  };
}

module.exports = filterYearMonth;
