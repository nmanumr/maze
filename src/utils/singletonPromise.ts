const cachedPromises: {[key: string]: Promise<any>} = {};

export function singletonPromise<T>(
  uid: string,
  executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void
): Promise<T> {
  if (cachedPromises[uid]) {
    return cachedPromises[uid];
  }

  const p = new Promise<T>(executor).finally(() => {
    delete cachedPromises[uid];
  });
  cachedPromises[uid] = p;
  return p;
}
