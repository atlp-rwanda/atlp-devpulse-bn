import { model, Schema } from 'mongoose';

const permissionSchema = new Schema({
  entity: {
    type: String,
    required: true,
  },
  create: {
    isPermitted: {
      type: Boolean,
      default: false,
    },
  },
  viewOwn: {
    isPermitted: {
      type: Boolean,
      default: false,
    },
  },
  viewMultiple: {
    isPermitted: {
      type: Boolean,
      default: false,
    },
  },
  viewOne: {
    isPermitted: {
      type: Boolean,
      default: false,
    },
  },
  updateOwn: {
    isPermitted: {
      type: Boolean,
      default: false,
    },
  },
  updateMultiple: {
    isPermitted: {
      type: Boolean,
      default: false,
    },
  },
  updateOne: {
    isPermitted: {
      type: Boolean,
      default: false,
    },
  },
  deleteOwn: {
    isPermitted: {
      type: Boolean,
      default: false,
    },
  },
  deleteMultiple: {
    isPermitted: {
      type: Boolean,
      default: false,
    },
  },
  deleteOne: {
    isPermitted: {
      type: Boolean,
      default: false,
    },
  },
});

export const PermissionModel = model('Permission', permissionSchema);
