export const lazyWrap = (factory: () => Promise<any>) => {
  return async () => {
    const page = await factory()
    return {
      Component: page.default || page.Component,
      ErrorBoundary: page.ErrorBoundary,
      loader: page.loader,
    }
  }
}
