class Company < ApplicationRecord
  belongs_to :owner, class_name: 'User'
  has_many :parent_shares, class_name: 'Share', foreign_key: 'child_id', dependent: :destroy, inverse_of: :child
  has_many :child_shares, class_name: 'Share', foreign_key: 'parent_id', dependent: :destroy, inverse_of: :parent

  def owning_users
    User.where(id: owner_id)
  end
end
