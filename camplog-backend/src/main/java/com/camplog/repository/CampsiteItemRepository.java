package com.camplog.repository;

import com.camplog.entity.CampsiteItem;
import com.camplog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampsiteItemRepository extends JpaRepository<CampsiteItem, Long> {

    List<CampsiteItem> findByUserOrderByUnlockedAtAsc(User user);

    boolean existsByUserAndItemType(User user, String itemType);
}