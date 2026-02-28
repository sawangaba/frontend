import React, { memo } from 'react';
import { PlayCircle } from 'lucide-react';
import BaseNode from './BaseNode';
import useBuilderStore from '../../../store/builderStore';

const ActionNode = ({ id, data, selected }) => {
    const setup = useBuilderStore((state) => state.setup);

    return (
        <BaseNode
            id={id}
            data={data}
            selected={selected}
            color="green"
            icon={PlayCircle}
            title="Action"
        >
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span>Do</span>
                    <span className="text-white">{data.actionType || 'Notify'}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>To</span>
                    <span className="text-white truncate max-w-[100px]">{data.target || 'Owner'}</span>
                </div>
            </div>
        </BaseNode>
    );
};

export default memo(ActionNode);
