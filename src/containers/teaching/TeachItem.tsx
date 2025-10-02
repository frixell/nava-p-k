import React, { useMemo, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Card,
    CardHeader,
    Actions,
    ContentRow,
    Image,
    TextColumn,
    HtmlBlock,
    OrderField
} from './TeachItem.styles';
import type { TeachItem as TeachItemType } from './types';

interface TeachItemProps {
    teach: TeachItemType;
    language: string;
    isAuthenticated: boolean;
    onEdit(teach: TeachItemType): void;
    onDelete(id: string): void;
    onToggleVisibility(id: string, visible: boolean): void;
    onOrderChange(id: string, order: number): void;
    onOrderCommit(id: string, order: number): Promise<void>;
}

const renderHtml = (html?: string) => ({ __html: html ?? '' });

const TeachItem: React.FC<TeachItemProps> = ({
    teach,
    language,
    isAuthenticated,
    onEdit,
    onDelete,
    onToggleVisibility,
    onOrderChange,
    onOrderCommit
}) => {
    const [isHovering, setIsHovering] = useState(false);
    const isHebrew = language === 'he';

    const detailHtml = useMemo(() => (
        isHebrew ? teach.detailsHebrew || teach.details || '' : teach.details || teach.detailsHebrew || ''
    ), [teach.details, teach.detailsHebrew, isHebrew]);

    const descriptionHtml = useMemo(() => (
        isHebrew
            ? teach.descriptionHebrew || teach.description || ''
            : teach.description || teach.descriptionHebrew || ''
    ), [teach.description, teach.descriptionHebrew, isHebrew]);

    const handleOrderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value || 0);
        onOrderChange(teach.id, value);
    };

    const handleOrderBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
        const value = Number(event.target.value || 0);
        await onOrderCommit(teach.id, value);
    };

    const handleOrderKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const value = Number((event.target as HTMLInputElement).value || 0);
            await onOrderCommit(teach.id, value);
        }
    };

    const toggleVisibility = () => {
        onToggleVisibility(teach.id, !(teach.visible ?? true));
    };

    const isVisible = teach.visible ?? true;

    return (
        <Card onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
            <CardHeader>
                {isAuthenticated && isHovering && (
                    <Actions>
                        <Tooltip title={isVisible ? 'Hide' : 'Show'}>
                            <IconButton size="small" onClick={toggleVisibility}>
                                {isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => onEdit(teach)}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => onDelete(teach.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Actions>
                )}

                {isAuthenticated && isHovering && (
                    <div>
                        <label htmlFor={`teach-order-${teach.id}`}>
                            {isHebrew ? 'מיקום' : 'Order'}
                        </label>
                        <OrderField
                            id={`teach-order-${teach.id}`}
                            type="number"
                            value={teach.order ?? 0}
                            onChange={handleOrderChange}
                            onBlur={handleOrderBlur}
                            onKeyPress={handleOrderKeyPress}
                        />
                    </div>
                )}
            </CardHeader>

            {teach.image?.src && (
                <Image
                    src={teach.image.src}
                    width={teach.image.width}
                    height={teach.image.height}
                    alt={isHebrew ? 'תמונה' : 'Image'}
                />
            )}

            <ContentRow isHebrew={isHebrew}>
                <TextColumn dir={isHebrew ? 'rtl' : 'ltr'}>
                    <HtmlBlock dangerouslySetInnerHTML={renderHtml(detailHtml)} />
                </TextColumn>
                <TextColumn dir={isHebrew ? 'rtl' : 'ltr'}>
                    <HtmlBlock dangerouslySetInnerHTML={renderHtml(descriptionHtml)} />
                </TextColumn>
            </ContentRow>
        </Card>
    );
};

export default TeachItem;
