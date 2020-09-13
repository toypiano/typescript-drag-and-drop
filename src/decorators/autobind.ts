export function autobind(
  target: any,
  name: string,
  descriptor: PropertyDescriptor,
) {
  console.log(target, name, descriptor);
  const originalMethod = descriptor.value;
  const updatedDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      return originalMethod.bind(this);
    },
  };
  return updatedDescriptor;
}
