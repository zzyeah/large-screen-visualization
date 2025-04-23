export function debounce(fn: Function, delay: number) {
  const delayTime = delay > 0 ? delay : 100;
  let timer: NodeJS.Timeout;
  return function (...args: any[]): void {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      typeof fn === "function" && fn.apply(null, args);
      clearTimeout(timer);
    }, delayTime);
  };
}
