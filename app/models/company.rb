class Company < ApplicationRecord
  belongs_to :owner, class_name: 'User'
  has_many :parent_shares, -> {
                             where(active: true)
                           }, class_name: 'Share', foreign_key: 'child_id', dependent: :destroy, inverse_of: :child
  has_many :child_shares, -> {
                            where(active: true)
                          }, class_name: 'Share', foreign_key: 'parent_id', dependent: :destroy, inverse_of: :parent

  def owning_users
    return User.where(id: owner_id) if parent_shares.empty?

    User.where(id: top_owning_companies.pluck(:owner_id))
  end

  def top_owning_companies
    top_companies = []
    visited_companies = []
    companies_stack = [self]

    while companies_stack.length.positive?
      current_company = companies_stack.pop
      visited_companies << current_company

      current_company.parent_shares.each do |share|
        next if visited_companies.include?(share.parent)

        companies_stack << share.parent
      end
    end

    top_companies
  end
end
