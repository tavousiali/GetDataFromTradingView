const showMoreData = (fromDate) => {
  const from = Math.round(fromDate.getTime() / 1000);
  const to = Math.round(new Date().getTime() / 1000);
  tvWidget.activeChart().setVisibleRange({ from, to });
};
showMoreData(new Date(2010, 0, 0));
