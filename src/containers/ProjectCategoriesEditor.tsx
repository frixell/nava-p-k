import React, { useCallback, useMemo } from 'react';

import {
    Container,
    Header,
    List,
    Row,
    Checkbox,
    Name
} from './ProjectCategoriesEditor.styles';
import type { ProjectEntity } from './projectTypes';

interface CategoryItem {
    id?: string | number;
    name: string;
    nameHebrew?: string;
}

interface ProjectCategoriesEditorProps {
    hideCategoryEditor: boolean;
    toggleCategoryEditor: () => void;
    categories?: CategoryItem[] | null;
    selectedProject: ProjectEntity | null;
    setProjectCategories: (value: string) => void;
}

const ProjectCategoriesEditor: React.FC<ProjectCategoriesEditorProps> = ({
    hideCategoryEditor,
    toggleCategoryEditor,
    categories,
    selectedProject,
    setProjectCategories
}) => {
    const selectedCategories = useMemo(() => {
        const raw = selectedProject?.categories;
        return raw ? raw.split(',').map((id) => id.trim()).filter(Boolean) : [];
    }, [selectedProject]);

    const selectedSet = useMemo(() => new Set(selectedCategories), [selectedCategories]);

    const handleCategoryStatus = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const categoryId = event.target.dataset.id;
        if (!categoryId) {
            return;
        }

        const nextSet = new Set(selectedSet);
        if (nextSet.has(categoryId)) {
            nextSet.delete(categoryId);
        } else {
            nextSet.add(categoryId);
        }

        setProjectCategories(Array.from(nextSet).join(','));
    }, [selectedSet, setProjectCategories]);

    return (
        <Container isHidden={hideCategoryEditor}>
            <Header type="button" onClick={toggleCategoryEditor}>
                X
            </Header>
            <List>
                {categories?.map((category) => {
                    const categoryId = String(category.id ?? category.name);
                    return (
                        <Row key={categoryId}>
                            <Checkbox
                                type="checkbox"
                                data-id={categoryId}
                                checked={selectedSet.has(categoryId)}
                                onChange={handleCategoryStatus}
                            />
                            <Name>{category.name}</Name>
                        </Row>
                    );
                })}
            </List>
        </Container>
    );
};

export default ProjectCategoriesEditor;
