import { useState, useMemo } from 'react'
import styles from './styles.module.css'; // O la ruta correcta
import skillsData from './skills.json'

function Skills() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSkillId, setSelectedSkillId] = useState(null)

  const { iconBasePath, skills } = skillsData
  const iconPath = (name) => `${iconBasePath}/${name}`

  const categoriesWithCount = useMemo(() => {
    const counts = { all: skills.length }
    skills.forEach(skill => {
      skill.categories.forEach(cat => {
        counts[cat] = (counts[cat] || 0) + 1
      })
    })
    return [
      { id: 'all', name: 'All' },
      { id: 'languages', name: 'Languages' },
      { id: 'frontend', name: 'Frontend' },
      { id: 'backend', name: 'Backend' },
      { id: 'databases', name: 'Databases' },
      { id: 'tools', name: 'Tools' },
      { id: 'devops', name: 'DevOps' },
    ].map(cat => ({ ...cat, count: counts[cat.id] || 0 }))
  }, [skills])

  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      const matchesSearch = searchTerm === '' ||
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === 'all' ||
        skill.categories.includes(selectedCategory)

      return matchesSearch && matchesCategory
    })
  }, [skills, searchTerm, selectedCategory])

  const selectedSkill = useMemo(() => {
    return skills.find(s => s.id === selectedSkillId)
  }, [skills, selectedSkillId])

  const levelLabels = ['', 'Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert']

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <div className={styles.sidebar}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className={styles.categoryContainer}>
            <div className={styles.sectionTitle}>Categories</div>
            <div className={styles.categoryList}>
              {categoriesWithCount.map(cat => (
                <div
                  key={cat.id}
                  className={`${styles.categoryItem} ${selectedCategory === cat.id ? styles.selected : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name} ({cat.count})
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.mainPanels}>
          <div className={styles.centerPanel}>
            <div className={styles.listContainer}>
              {filteredSkills.length === 0 ? (
                <div className={styles.noResults}>No items found</div>
              ) : (
                filteredSkills.map(skill => (
                  <div
                    key={skill.id}
                    className={`${styles.listItem} ${selectedSkillId === skill.id ? styles.selected : ''}`}
                    onClick={() => setSelectedSkillId(skill.id)}
                  >
                    <img src={iconPath(skill.icon)} alt="" className={styles.listIcon} />
                    <div className={styles.listText}>
                      <div className={styles.listTitle}>{skill.name}</div>
                      <div className={styles.listSubtitle}>{skill.description}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={styles.rightPanel}>
            <div className={styles.detailsContainer}>
              {selectedSkill ? (
                <>
                  <img src={iconPath(selectedSkill.icon)} alt="" className={styles.detailsIcon} />
                  <div className={styles.detailsTitle}>{selectedSkill.name}</div>
                  <div className={styles.detailsDescription}>{selectedSkill.description}</div>
                  <div className={styles.detailsMeta}>
                    Level: {levelLabels[selectedSkill.level] || 'Unknown'} ({selectedSkill.level}/5)
                  </div>
                  {selectedSkill.years && (
                    <div className={styles.detailsMeta}>
                      Experience: {selectedSkill.years} years
                    </div>
                  )}
                  <div className={styles.actionButtons}>
                    <button className={styles.actionButton} disabled>
                      Installed
                    </button>
                    <button className={styles.actionButton}>
                      Details
                    </button>
                  </div>
                </>
              ) : (
                <div className={styles.detailsPlaceholder}>
                  Select an item to view its details
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Skills
