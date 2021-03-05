import store from '@/store';

function checkPermission(el, binding) {
  const permissions = store.getters && store.getters.permissions;
  let { value } = binding;
  if (!value) {
    throw new Error(`need permissionName! Like v-permission="'custimerList'"`);
  }
  if (!(value instanceof Array)) {
    value = [value];
  }

  const hasPermission = value.some(p => permissions.includes(p));

  if (hasPermission) return;

  el.parentNode && el.parentNode.removeChild(el);
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding);
  },
  update(el, binding) {
    checkPermission(el, binding);
  }
};
