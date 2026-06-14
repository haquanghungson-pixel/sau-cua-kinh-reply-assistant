document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav .nav-link');

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      mobileNav.classList.toggle('active');
    });

    // Close menu when a link is clicked
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('active');
      });
    });
  }

  // Interactive Mock Dashboard Simulator
  const mockComments = [
    {
      id: 'comment-1',
      username: '@hannah_creator',
      avatar: 'H',
      avatarColor: 'accent-cyan',
      text: 'Loved this! Where can I get the checklist?',
      suggestions: [
        {
          id: 's-1-1',
          badge: 'Option A (Engaging)',
          text: 'Thanks Hannah! You can grab it from the link in my bio. Let me know if you like it! 🚀'
        },
        {
          id: 's-1-2',
          badge: 'Option B (Short)',
          text: 'Glad you loved it! Link is in my bio. Enjoy! 😊'
        }
      ]
    },
    {
      id: 'comment-2',
      username: '@tech_guy',
      avatar: 'T',
      avatarColor: 'accent-pink',
      text: 'Is this tool free?',
      suggestions: [
        {
          id: 's-2-1',
          badge: 'Option A (Direct)',
          text: 'Yes! The manual workflow MVP is completely free to use. 💻'
        },
        {
          id: 's-2-2',
          badge: 'Option B (Helpful)',
          text: 'Absolutely, it is free! We are focusing on a manual comment-to-draft workflow at zero cost. 🙌'
        }
      ]
    },
    {
      id: 'comment-3',
      username: '@travel_vlog',
      avatar: 'V',
      avatarColor: 'accent-cyan',
      text: 'Thanks for sharing! Very helpful.',
      suggestions: [
        {
          id: 's-3-1',
          badge: 'Option A (Appreciative)',
          text: 'You\'re very welcome! Thanks for watching. Let me know if you need anything else! ✈️'
        },
        {
          id: 's-3-2',
          badge: 'Option B (Friendly)',
          text: 'Thanks for the support! Glad it was helpful to your travel vlogging! ✨'
        }
      ]
    }
  ];

  const commentCardsContainer = document.getElementById('mock-comments-container');
  const suggestionsContainer = document.getElementById('mock-suggestions-container');
  const toast = document.getElementById('mock-toast');
  const toastText = document.getElementById('mock-toast-text');

  if (commentCardsContainer && suggestionsContainer) {
    let activeCommentId = 'comment-1';

    // Show Toast Notification Helper
    const showToast = (message) => {
      if (!toast || !toastText) return;
      toastText.textContent = message;
      toast.classList.add('active');
      setTimeout(() => {
        toast.classList.remove('active');
      }, 2500);
    };

    // Render AI suggestions for the active comment
    const renderSuggestions = (commentId) => {
      const comment = mockComments.find(c => c.id === commentId);
      if (!comment) return;

      suggestionsContainer.innerHTML = '';

      comment.suggestions.forEach((suggestion, index) => {
        const isSelected = index === 0; // Default select first suggestion
        
        const card = document.createElement('div');
        card.className = `suggestion-card ${isSelected ? 'selected' : ''}`;
        card.setAttribute('data-suggestion-id', suggestion.id);

        card.innerHTML = `
          <div class="suggestion-badge">${suggestion.badge}</div>
          <textarea class="suggestion-text" rows="2" disabled>${suggestion.text}</textarea>
          <div class="suggestion-footer">
            <button class="suggestion-btn btn-edit">Edit Suggestion</button>
            <button class="suggestion-btn btn-copy">Copy Reply</button>
          </div>
        `;

        // Handle suggestion card selection
        card.addEventListener('click', (e) => {
          // If clicking buttons inside suggestion card, don't trigger selection toggle
          if (e.target.closest('.suggestion-btn') || e.target.closest('textarea')) {
            return;
          }
          
          document.querySelectorAll('.suggestion-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
        });

        // Edit suggestion handler
        const editBtn = card.querySelector('.btn-edit');
        const textarea = card.querySelector('.suggestion-text');

        editBtn.addEventListener('click', () => {
          if (textarea.disabled) {
            textarea.disabled = false;
            textarea.focus();
            // Move cursor to end of text
            const textVal = textarea.value;
            textarea.value = '';
            textarea.value = textVal;
            editBtn.textContent = 'Save Draft';
            editBtn.style.borderColor = 'var(--success-color)';
            editBtn.style.color = 'var(--success-color)';
            showToast('Editing mode active. Review and modify.');
          } else {
            textarea.disabled = true;
            editBtn.textContent = 'Edit Suggestion';
            editBtn.style.borderColor = 'var(--border-color)';
            editBtn.style.color = 'var(--text-primary)';
            // Update local memory data for simulated persistence
            suggestion.text = textarea.value;
            showToast('Draft updated and saved locally!');
          }
        });

        // Copy suggestion handler
        const copyBtn = card.querySelector('.btn-copy');
        copyBtn.addEventListener('click', () => {
          const textToCopy = textarea.value;
          
          // Use standard clipboard API
          navigator.clipboard.writeText(textToCopy)
            .then(() => {
              copyBtn.textContent = 'Copied!';
              copyBtn.style.backgroundColor = 'var(--success-color)';
              copyBtn.style.borderColor = 'var(--success-color)';
              copyBtn.style.color = 'white';
              
              showToast('Copied! Ready to manually paste on TikTok.');

              setTimeout(() => {
                copyBtn.textContent = 'Copy Reply';
                copyBtn.style.backgroundColor = 'var(--primary-color)';
                copyBtn.style.borderColor = 'var(--primary-color)';
              }, 2000);
            })
            .catch(() => {
              // Fallback if clipboard API fails
              textarea.disabled = false;
              textarea.select();
              document.execCommand('copy');
              textarea.disabled = true;
              
              copyBtn.textContent = 'Copied!';
              showToast('Copied! (fallback selection method)');
              setTimeout(() => {
                copyBtn.textContent = 'Copy Reply';
              }, 2000);
            });
        });

        suggestionsContainer.appendChild(card);
      });
    };

    // Render comment cards
    const renderComments = () => {
      commentCardsContainer.innerHTML = '';
      
      mockComments.forEach(comment => {
        const isActive = comment.id === activeCommentId;
        const card = document.createElement('div');
        card.className = `mock-comment-card ${isActive ? 'active-comment' : ''}`;
        card.style.cursor = 'pointer';
        card.style.transition = 'all var(--transition-fast)';
        
        if (isActive) {
          card.style.borderColor = 'var(--text-primary)';
          card.style.boxShadow = 'var(--shadow-sm)';
          card.style.backgroundColor = 'var(--bg-secondary)';
        }

        card.innerHTML = `
          <div class="avatar ${comment.avatarColor}">${comment.avatar}</div>
          <div class="comment-info">
            <div class="commenter-name" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <span>${comment.username}</span>
              ${isActive ? '<span style="font-size: 0.65rem; background-color: var(--success-bg); color: var(--success-color); padding: 0.1rem 0.4rem; border-radius: 4px; font-weight: 700;">Selected</span>' : ''}
            </div>
            <div class="comment-text">${comment.text}</div>
          </div>
        `;

        card.addEventListener('click', () => {
          if (activeCommentId !== comment.id) {
            activeCommentId = comment.id;
            renderComments();
            renderSuggestions(activeCommentId);
          }
        });

        commentCardsContainer.appendChild(card);
      });
    };

    // Initial Render
    renderComments();
    renderSuggestions(activeCommentId);
  }
});
