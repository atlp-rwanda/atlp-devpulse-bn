import { model, Schema } from 'mongoose';

const permissionSchema = new Schema({
  entity: {
    type:String,
    enum:["Users","Application","Cohorts","Role","Finance"]
  },
  create: {
      type: Boolean,
      default: false,
  },
  viewOwn: {
      type: Boolean,
      default: false,
  },
  viewMultiple: {
      type: Boolean,
      default: false,
  },
  viewOne: {
      type: Boolean,
      default: false,
    },
  updateOwn: {
      type: Boolean,
      default: false,
  },
  updateMultiple: {
      type: Boolean,
      default: false,

  },
  updateOne: {
      type: Boolean,
      default: false,
  },
  deleteOwn: {
      type: Boolean,
      default: false,
  },
  deleteMultiple: {
      type: Boolean,
      default: false,
  },
  deleteOne: {
      type: Boolean,
      default: false,
  },
});

export const PermissionModel = model('Permission', permissionSchema);
