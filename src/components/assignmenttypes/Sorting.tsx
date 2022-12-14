import React from 'react';
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useMediaQuery } from 'react-responsive';

import { AUDIO_PATH, IMAGE_PATH } from '../../config';
import {
    isAudioOption,
    isImageOption,
    isTextOption,
} from '../../types';

import PlayButton from '../PlayButton';
import Question from '../Question';
import style from '../../styles/SortingAssignment.module.css';

import type {
    AssignmentAnswer,
    SortingAssignment,
    Option,
} from '../../types';

type ItemList = Array<Option>;


// a little function to help us with reordering the result
const reorder = (list: ItemList, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};


type Props = {
    assignment: SortingAssignment;
    selectAnswer: (answer: string[]) => void;
    selectedAnswer: string[] | undefined;
};

const orderItems = (items: ItemList, answerOrder: Array<string> | undefined): ItemList => {
    if ( !answerOrder ) {
        return [ ...items];
    }

    const out = [];
    for ( const answer of answerOrder ) {
        const found = items.find(item => item.value === answer);
        if ( found ) {
            out.push(found);
        }
    }

    return out;
};

const SortingAssignmentCard = ({ assignment, selectAnswer, selectedAnswer }: Props) => {
    const [items, setItems] = useState<ItemList>(orderItems(assignment.items, selectedAnswer));
    const isMobile = useMediaQuery({ query: '(max-width: 991px)' })

    const onDragEnd = (result: DropResult) => {
        // Dropped outside the list
        if (!result.destination) {
            return;
        }

        const new_items = reorder(
            items,
            result.source.index,
            result.destination.index
        );

        setItems(new_items);
        selectAnswer(new_items.map(item => item.value));
    };


    return (
        <div className={style.assignment}>
            <Question question={assignment.question} />
            <div className={style.ordering}>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable" direction={ isMobile ? 'vertical' : 'horizontal' }>
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                className={`${style.list} ${snapshot.isDraggingOver ? style.draggingOver : ''}`}
                                {...provided.droppableProps}
                            >
                                {items && items.map((item, index) => (
                                    <Draggable key={item.key || item.value} draggableId={String(item.key || item.value)} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                title={item.value}
                                                ref={provided.innerRef}
                                                className={`${style.item} ${snapshot.isDragging ? style.dragging : ''}`}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{...provided.draggableProps.style, backgroundColor: item.color}}
                                            >
                                                {
                                                    isTextOption(item)
                                                    && <div className="text-item">{item.text}</div>
                                                }
                                                {
                                                    isAudioOption(item)
                                                    && <div><PlayButton src={AUDIO_PATH(item.audio)} detune={item.detune} /></div>
                                                }
                                                {
                                                    isImageOption(item)
                                                    && <img src={IMAGE_PATH(item.image)} style={{ minWidth: 50, minHeight: 50 }} />
                                                }
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
};

export default SortingAssignmentCard;
