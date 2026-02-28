import React, { memo } from 'react';
import { GitFork } from 'lucide-react';
import { Handle, Position } from '@xyflow/react';
import BaseNode from './BaseNode';

const DecisionNode = ({ id, data, selected }) => {
    return (
        <div className="relative">
            <BaseNode
                id={id}
                data={data}
                selected={selected}
                color="orange"
                icon={GitFork}
                title="Decision / Rule"
                isGlobal={true} // We handle handles manually
            >
                <div className="space-y-2">
                    <div className="text-white italic truncate">If {data.condition || '...'}</div>
                </div>
            </BaseNode>

            {/* Input Handle */}
            <Handle
                type="target"
                position={Position.Left}
                className="!w-3 !h-3 !bg-neutral-600 !border-2 !border-neutral-900 hover:!bg-white transition-colors !top-1/2"
            />

            {/* True Handle */}
            <div className="absolute -right-3 top-1/3 flex items-center">
                <span className="mr-2 text-[10px] text-green-400 font-bold">YES</span>
                <Handle
                    id="true"
                    type="source"
                    position={Position.Right}
                    className="!w-3 !h-3 !bg-green-500 !border-2 !border-neutral-900 hover:!bg-white transition-colors !static"
                />
            </div>

            {/* False Handle */}
            <div className="absolute -right-3 bottom-1/3 flex items-center">
                <span className="mr-2 text-[10px] text-red-400 font-bold">NO</span>
                <Handle
                    id="false"
                    type="source"
                    position={Position.Right}
                    className="!w-3 !h-3 !bg-red-500 !border-2 !border-neutral-900 hover:!bg-white transition-colors !static"
                />
            </div>
        </div>
    );
};

export default memo(DecisionNode);
