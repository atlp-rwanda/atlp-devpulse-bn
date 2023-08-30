import mongoose,{ model, Schema } from 'mongoose';

const roleSchema = new Schema({
  roleName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  permissions: [{
    type: Schema.Types.ObjectId,
    ref: 'Permission',
  }],
});

export const RoleModel = model('Role', roleSchema);
