import React, { memo } from 'react';
import { Users } from 'lucide-react';
import BaseNode from './BaseNode';

const RolesNode = ({ data, selected }) => {
    return (
        <BaseNode
            data={data}
            selected={selected}
            color="red"
            icon={Users}
            title="People / Roles"
            isGlobal={true}
        >
            <div className="space-y-1 text-xs text-neutral-400">
                <div>• Owner</div>
                <div>• Manager</div>
                <div>• Employee</div>
            </div>
        </BaseNode>
    );
};

export default memo(RolesNode);
